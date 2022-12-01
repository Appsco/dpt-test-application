<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class UtilController extends AbstractController
{
    #[Route('/dpt-url', name: 'dpt_url', methods: ['GET'])]
    public function dptUrl()
    {
        return new JsonResponse([
            'dptUrl' => $this->getParameter('dptUrl')
        ]);
    }

}